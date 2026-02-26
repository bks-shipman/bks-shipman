import { Loader } from '@mantine/core'
import React from 'react'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
            <Loader size="lg" color="blue" />
        </div>
    )
}
