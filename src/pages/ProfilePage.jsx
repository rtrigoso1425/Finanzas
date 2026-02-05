import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById, clearSearchedUser } from '../features/user/userSlice';
import { Loader2 } from "lucide-react";
const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const { searchedUser, status, error } = useSelector((state) => state.user);
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
        
        return () => {
            dispatch(clearSearchedUser());
        };
    }, [dispatch, userId]);

    if (status === 'loading') {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    if (status === 'failed') {
        navigate('/dashboard'); 
    }

    if (!searchedUser) return null;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <img 
                src={searchedUser.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"} 
                alt={searchedUser.username}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-50"
            />
            <h2 className="mt-4 text-xl font-bold text-slate-800">{searchedUser.full_name}</h2>
            <p className="text-slate-500">@{searchedUser.username}</p>
        </div>
    );
}
export default ProfilePage;