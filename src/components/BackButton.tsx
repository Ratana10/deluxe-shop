import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  text: string;
}
export default function BackButton({ text }: Props) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center mb-2">
      <CircleArrowLeft className="w-4 h-4 mr-2" /> {text}
    </button>
  );
}
