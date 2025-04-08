import { Box, Typography } from "@mui/material";

export interface StorageTextProps {
    text: string | React.ReactNode;
}

export const StorageText: React.FC<StorageTextProps> = ({ text }) => {
    return (
        <Box
            sx={{
                minHeight: 300,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }}
        >
            {typeof text === 'string' ? (
                <Typography variant="body1">{text}</Typography>
            ) : (
                text
            )}
        </Box>
    )
};