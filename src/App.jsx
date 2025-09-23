import { useState, useEffect } from "react"
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db";


function App() {

    const initialCart = () => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : []
    }
    //state
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart);

    const maxQuantity = 5;
    const minQuantity = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])


    function addToCar (item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if(itemExists >= 0) {
            if(cart[itemExists].quantity >= maxQuantity) return; // Evitar que la cantidad supere el máximo
            const newCart = [...cart];
            newCart[itemExists].quantity ++;
            setCart(newCart);

        }
        else{
            item.quantity = 1;
            setCart([...cart, item])    
        }
    }

    function removeFromCar (id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity (id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < maxQuantity) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCart(updatedCart); 
    }

    function decreaseQuantity (id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > minQuantity) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCart(updatedCart); 
    }

    function clearCart() {
        setCart([]);
    }

    
  return (
    <>
    <Header 
    cart={cart}
    removeFromCar={removeFromCar}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
    clearCart={clearCart}   
    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar) => ( 
                <Guitar
                key={guitar.id} 
                guitar={guitar}
                cart={cart} 
                addToCar={addToCar}
                setCart={setCart}/>
            ))}
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
