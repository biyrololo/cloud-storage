import { Slider, Typography } from "@mui/material";
import { formatSize } from "@/shared/lib/size/getSize";
import Link from "next/link";

export interface StorageSpaceProps {
    maxSize: bigint;
    usedSpace: bigint;
}

export function StorageSpace({maxSize, usedSpace}: StorageSpaceProps){
    return (
        <div>
            <div className="flex justify-center gap-3 items-center">
                <Typography color="text.secondary">
                    Using {formatSize(usedSpace)} of {formatSize(maxSize)}
                </Typography>
                <Link href="/pricing">
                    <Typography color="primary.main">
                        Upgrade
                    </Typography>
                </Link>
            </div>
            <Slider
                value={Number(usedSpace)}
                min={0}
                max={Number(maxSize)}
                step={1}
                valueLabelDisplay="on"
                sx={{
                    '& .MuiSlider-thumb': {
                        display: 'none'
                    }
                }}
            />
        </div>
    )
}