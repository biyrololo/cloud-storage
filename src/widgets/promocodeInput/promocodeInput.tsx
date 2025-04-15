"use client"

import { usePromoCode } from "@/shared/lib/actions/promocode"
import { TextField, Button, Typography } from "@mui/material"
import { useActionState } from "react"

export function PromocodeInput(){
    const [state, formAction, isPending] = useActionState(usePromoCode, {
        error: {
            code: ''
        },
        values: {
            code: '',
        },
    });
    
    return (
        <form action={formAction} className="flex flex-col gap-2 w-[200px] mx-auto mb-10">
            <Typography variant="body1" color="primary" align="center">
                Have a promocode?
            </Typography>
            <TextField
                name="code"
                variant="standard"
                placeholder="123456"
                fullWidth
                autoComplete="off"
                slotProps={{
                    htmlInput: {
                        style: {
                            textAlign: 'center',
                            fontSize: 22,
                            textTransform: 'uppercase',
                        }
                    },
                    formHelperText: {
                        style: {
                            textAlign: 'center',
                        }
                    }
                }}
                error={!!state.error?.code}
                helperText={state.error?.code}
            />
            <Button type="submit" variant="contained" 
            size="small"
            loading={isPending}
            color={state.success ? 'success' : 'primary'}
            sx={{
                borderRadius: 100,
            }}>
                {
                    state.success ? 'Applied' : 'Apply'
                }
            </Button>
        </form>
    )
}