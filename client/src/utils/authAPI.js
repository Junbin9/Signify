import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// const API_URL = "http://localhost:8000";

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        // const idToken = userCredential.user.accessToken;
        localStorage.setItem('token', idToken);
        return { token: idToken };
    } catch (error) {
        console.error('Error logging in: ', error);
        return { error: error.code };
        // console.error(error);
        // console.error(error.code);
        // console.error(error.message);
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken);
        await updateProfile(user, {
            displayName: username
        });
        return { status: 201, token: idToken };
    } catch (error) {
        console.error('Error signing up: ', error);
        return { error: error.code };
    }
};