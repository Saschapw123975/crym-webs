function openSignupAnimation() {
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #0d1426 0%, #1d2a4a 50%, #0f172a 100%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s ease;
        font-family: 'Manrope', system-ui, sans-serif;
        color: #ffffff;
    `;

    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(61, 115, 255, 0.4); }
            50% { box-shadow: 0 0 40px rgba(61, 115, 255, 0.8); }
        }
        .signup-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideUp 0.8s ease;
            background: linear-gradient(120deg, #3d73ff 0%, #6dd8ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .signup-subtitle {
            font-size: 1.5rem;
            margin-bottom: 3rem;
            text-align: center;
            opacity: 0.9;
            animation: slideUp 0.8s ease 0.2s both;
            max-width: 600px;
            line-height: 1.5;
        }
        .signup-button {
            padding: 18px 48px;
            font-size: 1.2rem;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            background: linear-gradient(120deg, #3d73ff 0%, #6dd8ff 100%);
            color: white;
            cursor: pointer;
            animation: slideUp 0.8s ease 0.4s both, pulse 2s ease infinite;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 10px 30px rgba(61, 115, 255, 0.3);
        }
        .signup-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(61, 115, 255, 0.5);
            animation: glow 2s ease infinite;
        }
        .close-button {
            position: absolute;
            top: 30px;
            right: 30px;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            animation: slideUp 0.8s ease 0.6s both;
        }
        .close-button:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    
    overlay.innerHTML = `
        <button class="close-button" onclick="closeSignupAnimation()">×</button>
        <h1 class="signup-title">Create Your Account</h1>
        <p class="signup-subtitle">Press sign up and make your account with your key to unlock premium features</p>
        <a href="https:
    `;

    
    document.body.appendChild(overlay);

    
    window.closeSignupAnimation = function() {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
            delete window.closeSignupAnimation;
        }, 300);
    };

    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            window.closeSignupAnimation();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            window.closeSignupAnimation();
        }
    });
}
