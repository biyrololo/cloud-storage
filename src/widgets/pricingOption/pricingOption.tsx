import { Button, Card, CardContent, Typography } from "@mui/material";

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';

export interface PricingOptionProps {
    name: string;
    price: number;
    description: string;
    features: string[];
    selected: boolean;
    variant: 'primary' | 'secondary';
}

export function PricingOption({name, price, description, features, selected, variant}: PricingOptionProps){
    return (
        <Card sx={{borderRadius: 6, backgroundColor: variant === 'primary' ? 'secondary.main' : 'background.paper', color: variant === 'primary' ? 'white' : ''}}>
            <CardContent className="grid gap-6" sx={{p: 4}}>
                <Typography variant="h6" sx={{opacity: 0.6}}>{name}</Typography>
                <div className="flex items-end gap-2">
                    <Typography variant="h3" sx={{lineHeight: 1}} fontWeight={500}>${price}</Typography>
                    <Typography variant="h6" sx={{opacity: 0.6}}>/Month</Typography>
                </div>
                <Typography variant="body1" sx={{opacity: 0.7}}>{description}</Typography>
                <Button 
                variant={variant === 'primary' ? 'contained' : 'outlined'} 
                color={variant}
                fullWidth
                size="large"
                sx={{
                    borderRadius: 100,
                }}
                // href={`mailto:${process.env.CONTACT_EMAIL}`}
                >
                    {selected ? 'Selected' : 'Soon'}
                </Button>
                <div className="flex flex-col gap-2">
                    {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                            <CheckCircleSharpIcon color="primary"/>
                            <Typography variant="body1" fontWeight={500} sx={{opacity: 0.8}}>{feature}</Typography>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}