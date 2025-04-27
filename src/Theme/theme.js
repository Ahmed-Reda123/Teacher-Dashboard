import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#09122C', // Dark navy
        },
        secondary: {
            main: '#E0D8C3', // Softer neutral beige (better contrast)
        },
        background: {
            default: '#F4F6F8', // Light grayish background
            paper: '#FFFFFF', // Cards, forms, and elements
        },
        text: {
            primary: '#222', // Dark gray (improves readability)
            secondary: '#eee', // Softer secondary text
        },
    },
    typography: {
        fontFamily: 'Cairo, serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#222', // Dark text for headings
        },
        button: {
            textTransform: 'none',
            fontWeight: 'bold',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color:'#fff',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    "&:hover": {
                        backgroundColor: '#0A1A45', // Darker navy hover effect
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        color: '#222', // Ensures text inside inputs is visible
                        backgroundColor: '#FFF', // White background for contrast
                        "& fieldset": {
                            borderColor: "#BDBDBD", // Default light gray border
                        },
                        "&:hover fieldset": {
                            borderColor: "#5C6BC0", // Slight blue tint on hover
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#1E88E5", // Brighter blue on focus
                            borderWidth: "2px",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: '#666', // Label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1E88E5", // Label color when focused
                    },
                },
            },
        },
    },
});

export default theme;
