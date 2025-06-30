import { Breadcrumbs, Typography } from "@mui/material";

import Link from "next/link";
import { calculatePath } from "@/shared/lib/calculatePath";

export type PathProps = {
    path: string[];
    userId?: string;
}

export function Path({ path, userId }: PathProps) {
    return (
        <Breadcrumbs>
            {path.map((p, i) => (
                <Link href={calculatePath(path.slice(0, i + 1).join('/'), userId)} key={i}>
                    <Typography key={i}
                    sx={{
                        '&:hover': {
                            textDecoration: 'underline'
                        },
                        color: i === path.length - 1 ? 'text.primary' : ''
                    }}
                    >
                        {decodeURIComponent(p.replace('/', 'Root'))}
                    </Typography>
                </Link>
            ))}
        </Breadcrumbs>
    )
}