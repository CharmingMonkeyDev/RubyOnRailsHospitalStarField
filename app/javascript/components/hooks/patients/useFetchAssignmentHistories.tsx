import { useState, useEffect, useContext } from "react";
import { getHeaders } from "../../utils/HeaderHelper";
import { AuthenticationContext } from "../../Context";

const useFetchAssignmentHistories = (
  patientId,
  assignmentType,
  reFetchingKey
) => {
  const [assignmentHistories, setAssignmentHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authenticationSetting = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/patients/${patientId}/assignment_histories?assignment_type=${assignmentType}`,
          {
            method: "GET",
            headers: getHeaders(authenticationSetting.csrfToken),
          }
        );
        const result = await response.json();
        setAssignmentHistories(result.resource);
      } catch (err) {
        setError(`Error fetching ${assignmentType} history.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, [patientId, assignmentType, reFetchingKey]);

  return { assignmentHistories, loading, error };
};

export default useFetchAssignmentHistories;
