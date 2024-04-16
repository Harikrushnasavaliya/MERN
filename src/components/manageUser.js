import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';

const ManageUser = () => {
    const host = "http://localhost:5000";
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.user._id);
        }

        getUsers();
    }, []);
    const getUserIdFromToken = (token) => {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.user.id;
    };
    const getUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = getUserIdFromToken(token);
            const response = await fetch(`${host}/api/auth/getallusers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });
    
            if (response.ok) {
                const json = await response.json();
                const filteredUsers = json.filter(user => user._id !== userId);                
                setUsers(filteredUsers);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    
    const toggleAdminStatus = async (userId, isAdmin) => {
        try {
            const response = await fetch(`${host}/api/auth/promote/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token"),
                },
                body: JSON.stringify({ isAdmin: !isAdmin ? 'admin' : null }), // Update userType based on isAdmin
            });
            console.log(response);
            if (response.ok) {
                setUsers(prevUsers => {
                    return prevUsers.map(user =>
                        user._id === userId ? { ...user, userType: isAdmin ? null : 'admin' } : user
                    );
                });
            } else {
                console.error('Failed to toggle admin status');
            }
        } catch (error) {
            console.error('Error toggling admin status:', error);
        }
    };

    return (
        <div>
            <h1>Manage Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button
                                    variant={user.userType === 'admin' ? "danger" : "success"}
                                    onClick={() => toggleAdminStatus(user._id, user.userType === 'admin')}
                                >
                                    {user.userType === 'admin' ? "Remove Admin" : "Make Admin"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;
