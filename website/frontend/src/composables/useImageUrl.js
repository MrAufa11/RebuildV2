/**
 * COMPOSABLE UNTUK IMAGE URL
 * 
 * Menambahkan backend URL prefix untuk development
 * Di production, prefix tidak diperlukan (same domain)
 */

import { computed } from 'vue';

export function useImageUrl() {
    // Backend URL dari environment variable
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    /**
     * Convert image URL from database to full URL
     * @param {string} imageUrl - Image URL from database (e.g., /public/website/file.jpg)
     * @returns {string} - Full image URL
     */
    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        
        // Jika sudah full URL (http:// atau https://), return langsung
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        
        // Jika URL relatif (dimulai dengan /), tambahkan backend URL
        if (imageUrl.startsWith('/')) {
            // Di production, tidak perlu prefix (same domain)
            if (import.meta.env.PROD) {
                return imageUrl;
            }
            // Di development, tambahkan backend URL
            return `${backendUrl}${imageUrl}`;
        }
        
        // Jika relative path tanpa /, tambahkan backend URL + /public/website/
        return `${backendUrl}/public/website/${imageUrl}`;
    };
    
    /**
     * Computed helper untuk template
     * Usage: const imageUrl = useImageUrl().imageSrc(article.image_url)
     */
    const imageSrc = (imageUrl) => {
        return computed(() => getFullImageUrl(imageUrl));
    };
    
    return {
        getFullImageUrl,
        imageSrc
    };
}
