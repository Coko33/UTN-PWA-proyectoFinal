import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RedirectProvincia() {
  const { provincia } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/:provincia");
  });

  return null;
}
