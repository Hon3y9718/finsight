import { FinSightLogo } from '@/components/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication',
    description: 'Login or create an account to continue.',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <FinSightLogo className="size-12 text-primary" />
                </div>
                {children}
            </div>
        </div>
    );
}
