import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHhNq8KFSj7Q57_N4hSoHoGiefl6K3jUc",
  authDomain: "nua-mc-spa.firebaseapp.com",
  projectId: "nua-mc-spa",
  storageBucket: "nua-mc-spa.firebasestorage.app",
  messagingSenderId: "799717145184",
  appId: "1:799717145184:web:deda58b29874f358d72105",
  measurementId: "G-Z813Y7500E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State
let isAuthenticated = false;
let userProfile = null;
let authTimeout = null;

const createAuthOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--bg-main, #FFFFFF);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    `;

    const isMoonlit = document.body.classList.contains('moonlit-theme');
    const textColor = isMoonlit ? '#E0EADD' : '#2C3E50';
    const inputBg = isMoonlit ? 'rgba(255,255,255,0.05)' : '#fff';
    const inputBorder = isMoonlit ? 'rgba(255,255,255,0.1)' : '#ccc';

    overlay.innerHTML = `
        <div class="auth-card" style="
            background: var(--glass-bg, rgba(255, 255, 255, 0.95));
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(130, 160, 130, 0.2);
            color: ${textColor}
        ">
            <img src="assets/logo.png" alt="NUA Logo" style="width: 120px; margin-bottom: 20px;">
            <h2 style="font-family: 'Outfit', sans-serif; color: var(--brand-primary, #2D5A27); margin-bottom: 10px;">MC Members Area</h2>
            <p style="margin-bottom: 25px;">Please sign in to access NUA MC resources.</p>
            
            <div id="auth-error-container" style="display: none; background: rgba(211, 47, 47, 0.1); border: 1px solid #d32f2f; color: #d32f2f; padding: 10px; border-radius: 8px; font-weight: 600; text-align: left; margin-bottom: 15px; font-size: 0.9rem;">
            </div>

            <!-- Email / Password Form -->
            <form id="email-login-form" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                <input type="email" id="auth-email" placeholder="Email Address" required style="
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid ${inputBorder};
                    background: ${inputBg};
                    color: ${textColor};
                    font-size: 1rem;
                ">
                <input type="password" id="auth-password" placeholder="Password" required style="
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid ${inputBorder};
                    background: ${inputBg};
                    color: ${textColor};
                    font-size: 1rem;
                ">
                <button type="submit" style="
                    padding: 12px;
                    background: var(--brand-primary, #2D5A27);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                ">Sign In</button>
            </form>

            <div style="display: flex; align-items: center; margin: 20px 0;">
                <div style="flex: 1; height: 1px; background: rgba(130, 160, 130, 0.3);"></div>
                <span style="padding: 0 10px; font-size: 0.9rem; opacity: 0.7;">OR</span>
                <div style="flex: 1; height: 1px; background: rgba(130, 160, 130, 0.3);"></div>
            </div>

            <button id="google-signin-btn" style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
                padding: 12px;
                background: white;
                color: #444;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width: 18px; height: 18px;">
                Sign in with Google
            </button>
            
            <div style="margin-top: 25px; font-size: 0.85rem; opacity: 0.9; line-height: 1.5;">
                <p style="margin-bottom: 8px;"><strong>Only verified NUA MC members are authorized to view these documents.</strong></p>
                <p style="margin-bottom: 15px;">If you need access, contact <a href="mailto:nua-managing-committee@googlegroups.com" style="color: var(--brand-primary, #2D5A27); text-decoration: underline;">nua-managing-committee@googlegroups.com</a></p>
                <a href="#" onclick="window.history.length > 1 ? window.history.back() : window.location.href='index.html'; return false;" style="display: inline-block; padding: 8px 16px; background: rgba(0,0,0,0.05); border-radius: 6px; color: ${textColor}; text-decoration: none; font-weight: 600; transition: background 0.3s; border: 1px solid rgba(0,0,0,0.1);">&larr; Back to previous page</a>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event Listeners
    document.getElementById('email-login-form').addEventListener('submit', handleEmailLogin);
    document.getElementById('google-signin-btn').addEventListener('click', handleGoogleLogin);
};

const ALLOWED_EMAILS = [
    "bassraju@outlook.com",
    "ecirams@gmail.com",
    "kvchacko@gmail.com",
    "lakshman.mn@gmail.com",
    "lorrainefernandez1@gmail.com",
    "manjunatha.tn@gmail.com",
    "mvad.mysore@gmail.com",
    "prasad.mj@gmail.com"
];

const showErrorInModal = (message) => {
    const errorContainer = document.getElementById('auth-error-container');
    if (errorContainer) {
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = message;
    }
};

const hideErrorInModal = () => {
    const errorContainer = document.getElementById('auth-error-container');
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }
};

const checkAuthorization = (user) => {
    const email = user.email || "";
    // Allow if email ends with @nua.org OR is in the ALLOWED_EMAILS list
    if (email.endsWith('@nua.org') || ALLOWED_EMAILS.includes(email.toLowerCase())) {
        return true;
    }
    return false;
};

const handleEmailLogin = async (e) => {
    e.preventDefault();
    hideErrorInModal();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Authorization is handled by onAuthStateChanged
    } catch (error) {
        console.error("Email Login Error:", error);
        showErrorInModal("Login failed. Please check your email and password.");
    }
};

const handleGoogleLogin = async () => {
    hideErrorInModal();
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // Authorization is handled by onAuthStateChanged
    } catch (error) {
        console.error("Google Login Error:", error);
        showErrorInModal("Google sign-in failed. Please try again.");
    }
};

const updateUserAvatar = () => {
    let avatarContainer = document.querySelector('.header-right');

    if (!avatarContainer) {
        const desktopControls = document.querySelector('.desktop-only-controls');
        if (desktopControls) {
            const div = document.createElement('div');
            div.className = 'logged-in-user-info';
            div.style.cssText = 'display: flex; align-items: center; margin-left: 20px;';

            if (userProfile.picture) {
                div.innerHTML = `<img src="${userProfile.picture}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--brand-primary); margin-right: 10px;">`;
            } else {
                const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : (userProfile.email ? userProfile.email.charAt(0).toUpperCase() : 'U');
                div.innerHTML = `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--brand-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px;">${initial}</div>`;
            }

            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Sign Out';
            logoutBtn.style.cssText = 'background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 0.8rem; text-decoration: underline;';
            logoutBtn.onclick = handleSignOut;

            div.appendChild(logoutBtn);
            desktopControls.insertAdjacentElement('afterend', div);
        }
    }
};

const handleSignOut = async () => {
    try {
        await signOut(auth);
    } catch(e) {
        console.error("Sign out error", e);
    }
    isAuthenticated = false;
    userProfile = null;
    sessionStorage.removeItem('nua_auth');
    sessionStorage.removeItem('nua_token');
    window.location.reload();
};

const initAuth = () => {
    // 1. Prevent interacting with page behind
    if (!isAuthenticated) {
        document.body.style.overflow = 'hidden';
        createAuthOverlay();
    }

    // Set timeout to redirect to home page if inactive for 2 minutes and not authenticated
    authTimeout = setTimeout(() => {
        if (!isAuthenticated) {
            window.location.href = 'index.html';
        }
    }, 120000);

    // Listen for Firebase Auth State Changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if (!checkAuthorization(user)) {
                // User is authenticated but not authorized
                showErrorInModal(`This email address (${user.email}) is not authorized to access the Members Area.`);
                await signOut(auth);
                return;
            }

            // Authentication & Authorization successful
            if (authTimeout) clearTimeout(authTimeout);
            isAuthenticated = true;
            
            // Generate userProfile object
            userProfile = {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                picture: user.photoURL
            };

            // Retrieve ID token for backend authentication
            const idToken = await user.getIdToken();

            // Store in sessionStorage (preserve nua_auth for UI, add nua_token for API)
            sessionStorage.setItem('nua_auth', JSON.stringify({
                profile: userProfile,
                expires: Date.now() + 1000 * 60 * 60 * 2 // 2 Hours
            }));
            sessionStorage.setItem('nua_token', idToken);

            // Hide Overlay
            const overlay = document.getElementById('auth-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500); 
            }
            document.body.style.overflow = '';

            // Update UI
            document.dispatchEvent(new CustomEvent('nua-auth-success', { detail: userProfile }));
            updateUserAvatar();
        } else {
            // User is signed out
            isAuthenticated = false;
            userProfile = null;
            sessionStorage.removeItem('nua_auth');
            sessionStorage.removeItem('nua_token');
            const overlay = document.getElementById('auth-overlay');
            if (!overlay) {
                document.body.style.overflow = 'hidden';
                createAuthOverlay();
            }
        }
    });
};

// Start Auth Process on load
document.addEventListener('DOMContentLoaded', initAuth);
