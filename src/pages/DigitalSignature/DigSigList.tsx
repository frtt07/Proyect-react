import React, { useEffect, useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { DigitalSignatureService } from "../../services/digitalSignatureService";
import { DigitalSignature } from "../../models/DigitalSignature";

const DigitalSignatureList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        if (userId) {
          const data = await DigitalSignatureService.getByUserId(Number(userId));
          if (!data) {
            // Si el usuario no tiene firma, redirigimos a crear
            navigate(`/digital-signature/${userId}/crear`);
            return;
          }
          setSignature(data);
        }
      } catch (error: any) {
        // Si el backend devuelve 404 → el usuario no tiene firma todavía
        if (error.response && error.response.status === 404) {
          navigate(`/digital-signature/${userId}/crear`);
        } else {
          console.error("Error fetching signature:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSignature();
  }, [userId, navigate]);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4 text-center">
      <h3>
        {signature?.user?.name
          ? `${signature.user.name} - Signature`
          : "Signature"}
      </h3>

      {signature ? (
        <Card className="mt-3 p-3 shadow-sm">
          <img
            src={signature.photo}
            alt="Digital Signature"
            className="img-fluid mb-3"
            style={{ maxHeight: "250px" }}
          />
          <h5>{signature.user?.name}</h5>
          <p>{signature.user?.email}</p>

          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(`/digital-signature/${userId}/editar/${signature.id}`)}
          >
            Update Signature
          </Button>
        </Card>
      ) : (
        <p>No signature form.</p>
      )}
    </div>
  );
};

export default DigitalSignatureList;
