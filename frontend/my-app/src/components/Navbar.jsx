import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap styles
import styles from './styles/navbar.module.css';
import { FaRegUserCircle } from 'react-icons/fa';
import { LOGOUT } from '../redux/actionTypes';

function Navbar({ setFilterText }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle the modal
    const [showToast, setShowToast] = useState(false); // State to toggle the toast

    const handleLogoutClick = () => {
        setIsModalOpen(true); // Open the modal on logout click
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Close modal on cancel
    };

    const handleConfirm = async () => {
        try {
            navigate('/'); // Redirect to the login page
            dispatch({ type: LOGOUT });
            setShowToast(true); // Show the toast
            setTimeout(() => setShowToast(false), 2000); // Hide the toast after 2 seconds
            alert("Logout success")
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div>
            <div className={styles.box}>
                <div className={styles.left}>
                    <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTS3M53ulgIkmkNuDJnRdhAipr17X4D_L5DHcnSUvV9UsrRKCoH" alt="" />
                    <p>Table<span>Sprint</span></p>
                </div>
                <div className={styles.middle}>
                    {/* Optional filter input */}
                </div>
                <div className={styles.right} onClick={handleLogoutClick}>
                    <FaRegUserCircle />
                </div>
            </div>

            {/* Modal for logout confirmation */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Log Out</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                            <button className={styles.confirmButton} onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bootstrap Toast */}
            {showToast && (
                <div
                    className="toast show position-fixed top-0 end-0 m-3"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    style={{ zIndex: 1050 }}
                >
                    <div className="toast-header">
                        <strong className="me-auto">Logout Success</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        You have been logged out successfully.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
