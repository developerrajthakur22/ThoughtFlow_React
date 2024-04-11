//import.meta.env.VITE_BASE_URL  
export const BASE_URL = import.meta.env.VITE_BASE_URL || `http://localhost:5000`
export const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};

export const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const jwt = getCookie('jwtToken'); // Get JWT token from cookie
let userId;

if(jwt){
    const decodedToken = parseJwt(jwt);
    userId = decodedToken.userId;
}

export {userId};


    
