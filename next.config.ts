import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: [
            'grey-herring-327677.hostingersite.com',
            'preview--treehub-automation.lovable.app',
            'texastreeservicedirectory.com',
        ]
    }
};

export default nextConfig;
