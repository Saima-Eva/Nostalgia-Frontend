import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineUser } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { FaGenderless, FaRegCalendarAlt, FaMapMarkerAlt, FaPhone, FaIdCard } from "react-icons/fa";
import api from '../../util/api';
import './signup.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [divisions, setDivisions] = useState([
        "Dhaka",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Chattogram",
        "Sylhet",
        "Mymensingh"
    ]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        walk_type: 'alone',
        gender: '',
        phone: '',
        dob: '',
        address: '',
        nid: '',
        thana: '',
        division: '',
        district: '',
        confirm_password: ''
    });

    // Check if already logged in
    useEffect(() => {
        const existingToken = localStorage.getItem('token');
        if (existingToken) {
            navigate('/home');
        }
    }, [navigate]);

    const findThana = (district) => {
        if (!district) return;
        axios.get(`${api.url}:8000/findthana`, { params: { district } })
            .then(response => {
                setUpazilas(response.data || []);
            })
            .catch(error => {
                console.error('Error fetching thanas:', error);
                setUpazilas([]);
            });
    };

    const findDistrict = (division) => {
        if (!division) return;
        axios.get(`${api.url}:8000/finddistrict`, { params: { division } })
            .then(response => {
                setDistricts(response.data || []);
                setUpazilas([]); // Reset upazilas when division changes
            })
            .catch(error => {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        // Clear related errors
        if (error[name]) {
            setError(prev => ({ ...prev, [name]: '' }));
        }
        
        // Load districts/upazilas based on selection
        if (name === "division") {
            findDistrict(value);
            setFormData(prev => ({ ...prev, district: '', thana: '' }));
        } else if (name === "district") {
            findThana(value);
            setFormData(prev => ({ ...prev, thana: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = '* Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = '* Username must be at least 3 characters';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = '* Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = '* Please enter a valid email';
        }
        
        // First name
        if (!formData.first_name.trim()) {
            newErrors.first_name = '* First name is required';
        }
        
        // Last name
        if (!formData.last_name.trim()) {
            newErrors.last_name = '* Last name is required';
        }
        
        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = '* Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s\-\+()]/g, ''))) {
            newErrors.phone = '* Please enter a valid phone number';
        }
        
        // NID validation
        if (!formData.nid.trim()) {
            newErrors.nid = '* NID is required';
        }
        
        // Address
        if (!formData.address.trim()) {
            newErrors.address = '* Address is required';
        }
        
        // Location validation
        if (!formData.division) {
            newErrors.division = '* Please select a division';
        }
        if (!formData.district) {
            newErrors.district = '* Please select a district';
        }
        if (!formData.thana) {
            newErrors.thana = '* Please select a thana/upazila';
        }
        
        // Gender
        if (!formData.gender.trim()) {
            newErrors.gender = '* Gender is required';
        }
        
        // Date of Birth validation
        if (!formData.dob) {
            newErrors.dob = '* Date of birth is required';
        } else {
            const currentDate = new Date();
            const birthDate = new Date(formData.dob);
            const age = currentDate.getFullYear() - birthDate.getFullYear() -
                (currentDate.getMonth() < birthDate.getMonth() || 
                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);
            
            if (age < 50) {
                newErrors.dob = '* You must be at least 50 years old to register';
            }
            if (age > 120) {
                newErrors.dob = '* Please enter a valid date of birth';
            }
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = '* Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = '* Password must be at least 6 characters';
        }
        
        // Confirm password
        if (!formData.confirm_password) {
            newErrors.confirm_password = '* Please confirm your password';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = '* Passwords do not match';
        }
        
        return newErrors;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        setLoading(true);
        setError({});
        setSuccessMessage('');

        try {
            // Prepare registration data
            const registrationData = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                walk_type: formData.walk_type,
                gender: formData.gender,
                phone: formData.phone,
                dob: formData.dob,
                address: formData.address,
                nid: formData.nid,
                thana: formData.thana,
                division: formData.division,
                district: formData.district
            };

            const response = await axios.post(`${api.url}:8000/sign`, registrationData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.message) {
                setError({ general: err.response.data.message });
            } else if (err.response?.data) {
                // Handle field-specific errors from backend
                setError(err.response.data);
            } else {
                setError({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container">
            <div className="container-form">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <p>Please fill in the inputs below (Age requirement: 50+)</p>

                    {/* Success Message */}
                    {successMessage && (
                        <div style={{ 
                            color: '#2e7d32', 
                            backgroundColor: '#e8f5e9',
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            ✓ {successMessage}
                        </div>
                    )}

                    {/* General Error */}
                    {error.general && (
                        <div style={{ 
                            color: '#d32f2f', 
                            backgroundColor: '#ffebee',
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            ✗ {error.general}
                        </div>
                    )}

                    {/* Username */}
                    <div className="inputBox">
                        <AiOutlineUser className='username' />
                        <input className='form-control' type='text'
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder='Username (min 3 characters)'
                            disabled={loading}
                        />
                    </div>
                    {error.username && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.username}</span>}

                    {/* First Name */}
                    <div className="inputBox">
                        <AiOutlineUser className='first_name' />
                        <input className='form-control' type='text'
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder='First Name'
                            disabled={loading}
                        />
                    </div>
                    {error.first_name && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.first_name}</span>}

                    {/* Last Name */}
                    <div className="inputBox">
                        <AiOutlineUser className='last_name' />
                        <input className='form-control' type='text'
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder='Last Name'
                            disabled={loading}
                        />
                    </div>
                    {error.last_name && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.last_name}</span>}

                    {/* Email */}
                    <div className="inputBox">
                        <FiMail className='mail' />
                        <input className='form-control' type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email Address'
                            disabled={loading}
                        />
                    </div>
                    {error.email && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.email}</span>}

                    {/* Phone */}
                    <div className="inputBox">
                        <FaPhone className='phone' />
                        <input className='form-control' type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder='Phone Number'
                            disabled={loading}
                        />
                    </div>
                    {error.phone && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.phone}</span>}

                    {/* NID */}
                    <div className="inputBox">
                        <FaIdCard className='nid' />
                        <input className='form-control' type="text"
                            name="nid"
                            value={formData.nid}
                            onChange={handleChange}
                            placeholder='National ID (NID)'
                            disabled={loading}
                        />
                    </div>
                    {error.nid && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.nid}</span>}

                    {/* Address */}
                    <div className="inputBox">
                        <FaMapMarkerAlt className='address' />
                        <input className='form-control' type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder='Full Address'
                            disabled={loading}
                        />
                    </div>
                    {error.address && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.address}</span>}

                    {/* Division */}
                    <div className="inputBox">
                        <select className='form-control' name="division" 
                            value={formData.division}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select Division *</option>
                            {divisions.map((division) => (
                                <option key={division} value={division}>
                                    {division}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error.division && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.division}</span>}

                    {/* District */}
                    {formData.division && districts.length > 0 && (
                        <div className="inputBox">
                            <select className='form-control' name="district" 
                                value={formData.district}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Select District *</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {error.district && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.district}</span>}

                    {/* Thana */}
                    {formData.district && upazilas.length > 0 && (
                        <div className="inputBox">
                            <select className='form-control' name="thana" 
                                value={formData.thana}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Select Thana/Upazila *</option>
                                {upazilas.map((upazila) => (
                                    <option key={upazila} value={upazila}>
                                        {upazila}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {error.thana && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.thana}</span>}

                    {/* Gender */}
                    <div className="inputBox">
                        <FaGenderless className='gender' />
                        <select className='form-control'
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Select Gender *</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {error.gender && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.gender}</span>}

                    {/* Date of Birth */}
                    <div className="inputBox">
                        <FaRegCalendarAlt className='dob' />
                        <input className='form-control' type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    {error.dob && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.dob}</span>}

                    {/* Password */}
                    <div className="inputBox">
                        <RiLockPasswordLine className='password' />
                        <input className='form-control' type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password (min 6 characters)'
                            disabled={loading}
                        />
                    </div>
                    {error.password && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.password}</span>}

                    {/* Confirm Password */}
                    <div className="inputBox">
                        <RiLockPasswordLine className='password' />
                        <input className='form-control' type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder='Confirm Password'
                            disabled={loading}
                        />
                    </div>
                    {error.confirm_password && <span style={{ color: "red", fontSize: '12px' }}>⚠ {error.confirm_password}</span>}

                    {/* Submit Button */}
                    <div className='divBtn'>
                        <small className='FG'><Link to="/">Already have an account?</Link></small>
                        <button type="submit" className='loginBtn' disabled={loading}>
                            {loading ? 'SIGNING UP...' : 'SIGN UP'}
                        </button>
                    </div>
                </form>

                {/* Already have an account */}
                <div className='dont'>
                    <p>Already have an account? <Link to="/"><span>Sign in</span></Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
