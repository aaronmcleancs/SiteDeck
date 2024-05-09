function extractColors(html) {
    const hexColors = html.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g);
    const rgbColors = html.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);

    const allColors = [...(hexColors || []), ...(rgbColors || [])];

    function isGrayscale(color) {
        if (color.startsWith('#')) {
            const r = parseInt(color.substring(1, 3), 16);
            const g = parseInt(color.substring(3, 5), 16);
            const b = parseInt(color.substring(5, 7), 16);
            return r === g && g === b;
        } else if (color.startsWith('rgb')) {
            const match = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(color);
            return match && parseInt(match[1]) === parseInt(match[2]) && parseInt(match[2]) === parseInt(match[3]);
        }
        return false;
    }

    return allColors.filter(color => !isGrayscale(color));
}
function generateGradient(colors) {
    if (colors.length === 0) return '';
    if (colors.length === 1) return colors[0];
    
    let gradient = 'linear-gradient(45deg, ';
    gradient += colors.join(', ');
    gradient += ')';
    return gradient;
}
