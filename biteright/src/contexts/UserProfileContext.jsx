import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export function useUserProfile() {
    return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            loadUserProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [currentUser]);

    async function loadUserProfile() {
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error('Erorr: Your Profile is cooked!: ', error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }

    async function createProfile(profileData) {
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const newProfile = {
                ...profileData,
                email: currentUser.email,
                created_at: new Date(),
                updated_at: new Date() 
            };

            await setDoc(docRef, newProfile);
            setProfile(newProfile);
            return true;
        } catch (error) {
            console.error('Error Creating Profile: ', error);
            return false;
        }
    }

    async function updateProfile(updates) {
        try {
            const docRef = doc(db, 'users', currentUser.uid)
            const updatedProfile = {
                ...profile,
                ...updates,
                updated_at: new Date()
            };

            await updateDoc(docRef, updatedProfile);
            setProfile(updatedProfile);
            return true;
        } catch (error) {
            console.error('Error updating the porfile: ', error);
            return false;
        }
    }

    const value = {
        profile,
        loading,
        createProfile,
        updateProfile,
        hasProfile: !!profile
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
}