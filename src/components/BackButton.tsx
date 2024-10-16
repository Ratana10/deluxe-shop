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
      className="flex items-center py-4">
      <CircleArrowLeft className="w-5 h-5 mr-2" /> {text}
    </button>
  );
}
