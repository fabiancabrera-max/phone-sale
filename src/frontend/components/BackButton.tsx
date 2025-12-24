'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function BackButton() {
    const router = useRouter();

    return (
        <Link
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white cursor-pointer transition-all duration-300"
            sx={{
                '&:hover': {
                    transform: 'translateX(-4px)',
                },
            }}
        >
            <ArrowBack fontSize="small" />
        </Link>
    );
}
