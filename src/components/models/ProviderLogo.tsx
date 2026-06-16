import { 
    OpenAI, 
    Anthropic, 
    Google, 
    Meta, 
    Mistral,
    DeepSeek, 
    XAI       
} from '@lobehub/icons';

interface ProviderLogoProps {
    providerName: string;
    size?: number;
    className?: string;
}

export function ProviderLogo({ providerName, size = 16, className = "" }: ProviderLogoProps) {
    if (!providerName) {
        return (
            <div 
                style={{ width: size, height: size, minWidth: size, minHeight: size }} 
                className={`bg-atlas-bg-tertiary rounded flex items-center justify-center text-[10px] font-bold ${className}`}
            >
                ?
            </div>
        );
    }

    const name = providerName.toLowerCase();

    if (name.includes("openai")) return <OpenAI size={size} className={className} />;
    if (name.includes("anthropic")) return <Anthropic size={size} className={className} />;
    if (name.includes("google")) return <Google size={size} className={className} />;
    if (name.includes("meta") || name.includes("llama")) return <Meta size={size} className={className} />;
    if (name.includes("mistral")) return <Mistral size={size} className={className} />;
    if (name.includes("deepseek")) return <DeepSeek size={size} className={className} />;
    if (name.includes("xai") || name.includes("grok")) return <XAI size={size} className={className} />;
    
    const firstLetter = providerName.charAt(0).toUpperCase();

    return (
        <div 
            style={{ width: size, height: size, minWidth: size, minHeight: size }} 
            className={`bg-atlas-purple/10 text-atlas-purple border border-atlas-purple/20 rounded flex items-center justify-center text-[10px] font-bold ${className}`}
        >
            {firstLetter}
        </div>
    );
}