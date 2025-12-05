import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import './PlaceOrder.css'
import { useEffect } from 'react'
import Navbar from '../../../components/User/Navbar/NavBar'
import api from '../../../config/api' 

const PlaceOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});

    const [cartItems, setCartItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

 
    const promoState = location.state?.isPromocodeApplied
        ? {
              isPromocodeApplied: true,
              code: location.state.promocode,
              discountAmount: location.state.discountAmount || 0,
          }
        : { isPromocodeApplied: false };

    useEffect(() => {
        loadCartAndUser();
    }, []);

    const loadCartAndUser = async () => {
        try {
            const cartResponse = await api.get('/app2/api/v1/cart');
            setCartItems(cartResponse.data);

            const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
            setCurrentUser(user);
            setLoading(false);
        } catch (error) {
            setCartItems([]);
            setLoading(false);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliverycharge = 30;

    const discountAmount = promoState.isPromocodeApplied ? promoState.discountAmount : 0;
    const finalTotal = Math.max(totalPrice + deliverycharge - discountAmount, 0);

    const validateForm = () => {
        const newErrors = {};

        
        if (!firstname.trim()) {
        newErrors.firstname = 'First name is required';
        } else if (!/^[a-zA-Z]+$/.test(firstname.trim())) {
        newErrors.firstname = 'First name must contain only alphabets and no spaces';
        }

        if (!lastname.trim()) {
        newErrors.lastname = 'Last name is required';
        } else if (!/^[a-zA-Z]+$/.test(lastname.trim())) {
          newErrors.lastname = 'Last name must contain only alphabets and no spaces';
        }

        if (!street.trim()) {
            newErrors.street = 'Street is required';
        }

     
        if (!city.trim()) {
            newErrors.city = 'City is required';
        }
        else if(!/^[a-zA-Z]+$/.test(city.trim())){
            newErrors.city = 'City must contain only alphabets and no spaces';
        }

     
        if (!state.trim()) {
            newErrors.state = 'State is required';
        }
        else if(!/^[a-zA-Z ]+$/.test(state.trim())){
            newErrors.state = 'Only Alphabet is required in State';
        }

        if (!zipcode.trim()) {
            newErrors.zipcode = 'Pin is required';
        } else if (!/^[0-9]{6}$/.test(zipcode)) {
            newErrors.zipcode = 'PIN code must be exactly 6 digits';
        }

     
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            const orderData = {
                address: {
                    firstName: firstname,
                    lastName: lastname,
                    street: street,
                    city: city,
                    state: state,
                    pin: zipcode,
                    phoneNo: phone
                },
                items: cartItems.map(item => ({
                    foodId: item.foodId,
                    quantity: item.quantity
                })),
                
                ...(promoState.isPromocodeApplied && promoState.code ? { promoCode: promoState.code } : {})
            };

            const res = await api.post('/app2/api/v1/orders/place', orderData);

            if (res.status === 201) {
                toast.success('Order placed successfully!');
                await api.delete('/app2/api/v1/cart/clear');
                navigate('/user/myorders');
            }
        } catch (err) {
            console.error('Order placement error:', err);
        }
    }

    return (
        <>
            <Navbar/>
            <form className='place-order main-content' onSubmit={handleSubmit}>
                <div className='place-order-left'>
                    <p className="title">Delivery Information</p>
                    <div className='multi-fields'>
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder='First Name'
                                value={firstname}
                                onChange={(e) => {
                                    setFirstname(e.target.value);
                                    if (errors.firstname) setErrors({...errors, firstname: ''});
                                }}
                                className={errors.firstname ? 'input-error' : ''}
                            />
                            {errors.firstname && <span className="error-message">{errors.firstname}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="lastName"
                                placeholder='Last Name'
                                value={lastname}
                                onChange={(e) => {
                                    setLastname(e.target.value);
                                    if (errors.lastname) setErrors({...errors, lastname: ''});
                                }}
                                className={errors.lastname ? 'input-error' : ''}
                            />
                            {errors.lastname && <span className="error-message">{errors.lastname}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="street"
                            placeholder='Street'
                            value={street}
                            onChange={(e) => {
                                setStreet(e.target.value);
                                if (errors.street) setErrors({...errors, street: ''});
                            }}
                            className={errors.street ? 'input-error' : ''}
                        />
                        {errors.street && <span className="error-message">{errors.street}</span>}
                    </div>
                    <div className="multi-fields">
                        <div className="form-group">
                            <input
                                type="text"
                                name="city"
                                placeholder='City'
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    if (errors.city) setErrors({...errors, city: ''});
                                }}
                                className={errors.city ? 'input-error' : ''}
                            />
                            {errors.city && <span className="error-message">{errors.city}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="state"
                                placeholder='State'
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value);
                                    if (errors.state) setErrors({...errors, state: ''});
                                }}
                                className={errors.state ? 'input-error' : ''}
                            />
                            {errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="zipCode"
                            placeholder='Zip Code (6 digits)'
                            value={zipcode}
                            onChange={(e) => {
                                setZipcode(e.target.value);
                                if (errors.zipcode) setErrors({...errors, zipcode: ''});
                            }}
                            className={errors.zipcode ? 'input-error' : ''}
                            maxLength={6}
                        />
                        {errors.zipcode && <span className="error-message">{errors.zipcode}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder='Phone (10 digits)'
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({...errors, phone: ''});
                            }}
                            className={errors.phone ? 'input-error' : ''}
                            maxLength={10}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                </div>
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        {/* No promocode section here */}
                        <div>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>₹{totalPrice}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery Charges</p>
                                <p>₹{deliverycharge}</p>
                            </div>
                            {promoState.isPromocodeApplied && discountAmount > 0 && (
                                <>
                                    <hr />
                                    <div className="cart-total-details discount-row">
                                        <p>Promo Discount</p>
                                        <p className="discount-amount">-₹{discountAmount.toFixed(2)}</p>
                                    </div>
                                </>
                            )}
                            <hr />
                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>₹{finalTotal.toFixed(2)}</b>
                            </div>
                        </div>
                        <button type="submit" className="">
                            <div className="order-loader">
                                <div className=""></div>
                                <span>Place Order</span>
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default PlaceOrder