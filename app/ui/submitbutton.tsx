import { useFormStatus } from "react-dom";

export default function SubmitButton({ rotulo }: { rotulo: string }) {

  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>{rotulo}</button>
  );

}