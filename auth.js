// auth.js
// Basic Authentication Overlay for NUA Members Resources

const GOOGLE_CLIENT_ID = "772239537570-70m35m5h0190abucrk4b4lggqn45jtgc.apps.googleusercontent.com"; // Placeholder for the actual client ID

// State
let isAuthenticated = false;
let userProfile = null;

const createAuthOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    // Style directly to avoid depending on CSS loading order initially, though it will be in style.css
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
            <h2 style="font-family: 'Outfit', sans-serif; color: var(--brand-primary, #2D5A27); margin-bottom: 10px;">Members Area</h2>
            <p style="margin-bottom: 25px;">Please sign in with your Google account to access NUA resources.</p>
            
            <div id="google-signin-btn-container" style="display: flex; justify-content: center; min-height: 40px;">
                <!-- Google Sign-In button will render here -->
            </div>
            
            <div style="margin-top: 20px; font-size: 0.85rem; opacity: 0.7;">
                <p>Only verified NUA members are authorized to view these documents.</p>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);
};

const ALLOWED_EMAILS = [
    // TODO: Replace with actual emails from nua-managing-committee@googlegroups.com
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
    const btnContainer = document.getElementById('google-signin-btn-container');

    // Clear the button area and show error
    if (btnContainer) {
        btnContainer.style.flexDirection = 'column';
        btnContainer.innerHTML = `
            <div style="background: rgba(211, 47, 47, 0.1); border: 1px solid #d32f2f; color: #d32f2f; padding: 15px; border-radius: 8px; font-weight: 600; text-align: left;">
                <span style="font-size: 1.2rem; display: block; margin-bottom: 5px;">Access Restricted</span>
                ${message}
            </div>
            <button onclick="window.location.reload()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: var(--brand-primary, #2D5A27);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">Try Another Account</button>
        `;
    }
};

const handleCredentialResponse = (response) => {
    console.log("Authentication Response received");

    let payload;
    let email = "";

    try {
        // Validating the Google JWT ID token
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        payload = JSON.parse(jsonPayload);
        email = payload.email;

        // Check expiry
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
            showErrorInModal("Your login session has expired. Please sign in again.");
            return;
        }

    } catch (e) {
        console.error("Failed to parse or validate JWT", e);
        showErrorInModal("Invalid authentication token. Please try signing in again.");
        return;
    }

    // Check Email Whitelist
    if (!ALLOWED_EMAILS.includes(email)) {
        console.warn(`Unauthorized login attempt. Email ${email} is not in the allowed list.`);
        showErrorInModal(`This email address (${email}) is not authorized to access the Members Area. Please ensure you are signing in with your registered NUA Managing Committee email.`);
        return;
    }

    // Authentication and Authorization successful
    isAuthenticated = true;
    userProfile = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
    };

    // Save session
    sessionStorage.setItem('nua_auth', JSON.stringify({
        profile: userProfile,
        expires: Date.now() + 1000 * 60 * 60 * 0.5 // 30 Minutes
    }));

    // Hide Overlay
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500); // Remove after fade out
    }

    // Update UI 
    document.dispatchEvent(new CustomEvent('nua-auth-success', { detail: userProfile }));
    updateUserAvatar();
};

const updateUserAvatar = () => {
    // Update the header avatar if present (like in index.html)
    // We'll create elements if they don't exist
    let avatarContainer = document.querySelector('.header-right');

    // If we have a header but no specific right container, add it
    if (!avatarContainer) {
        const desktopControls = document.querySelector('.desktop-only-controls');
        if (desktopControls) {
            const div = document.createElement('div');
            div.className = 'logged-in-user-info';
            div.style.cssText = 'display: flex; align-items: center; margin-left: 20px;';

            if (userProfile.picture) {
                div.innerHTML = `<img src="${userProfile.picture}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--brand-primary); margin-right: 10px;">`;
            } else {
                const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
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

const handleSignOut = () => {
    isAuthenticated = false;
    userProfile = null;
    sessionStorage.removeItem('nua_auth');
    // Reload page to reset state (which will show the auth overlay again)
    window.location.reload();
};

const initAuth = () => {
    // 0. Check cached session
    const savedSessionString = sessionStorage.getItem('nua_auth');
    if (savedSessionString) {
        try {
            const savedSession = JSON.parse(savedSessionString);
            if (savedSession && savedSession.expires > Date.now()) {
                isAuthenticated = true;
                userProfile = savedSession.profile;
                document.dispatchEvent(new CustomEvent('nua-auth-success', { detail: userProfile }));
                updateUserAvatar();
                return; // Skip rendering auth overlay completely
            } else {
                sessionStorage.removeItem('nua_auth');
            }
        } catch (e) {
            sessionStorage.removeItem('nua_auth');
        }
    }

    // 1. Prevent interacting with page behind
    document.body.style.overflow = 'hidden';

    // 2. Create Overlay
    createAuthOverlay();

    // 3. Load Google Identity Services Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        // Initialize Google Sign-In Options
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });

        // Render Button
        google.accounts.id.renderButton(
            document.getElementById("google-signin-btn-container"),
            { theme: "outline", size: "large", type: "standard", shape: "pill" }
        );

        // Optionally prompt One Tap
        // google.accounts.id.prompt();
    };

    document.head.appendChild(script);

    // Listen for auth success to restore body scrolling
    document.addEventListener('nua-auth-success', () => {
        document.body.style.overflow = '';
    });
};

// Start Auth Process on load
document.addEventListener('DOMContentLoaded', initAuth);
