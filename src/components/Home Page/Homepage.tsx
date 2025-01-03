import {useEffect, useState} from 'react';
import './Homepage.css'

type Policy = {
    id: string;
    policyName: string;
    category: string;
    company: string;
    cover: string;
    totalPremium: number;
    duration: number;
    claimPercent: number;
    appliedUser: number[];
  };

  const PolicyCard: React.FC<{ policy: Policy }> = ({ policy }) => (
    <div className="policy-card border rounded shadow p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold">{policy.policyName}</h2>
      </div>
      <p className="text-gray-600">{policy.company}</p>
      <p>Cover: {policy.cover}</p>
      <p>{policy.category}</p>
      <p>Claim Settled: <b>{policy.claimPercent}%</b></p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        ${policy.totalPremium}/month
      </button>
    </div>
  );
  
  const PolicyList: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      // Fetch data from the Spring Boot API
      const fetchPolicies = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/v1/policy/'); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error('Failed to fetch policies');
          }
          const data = await response.json();
          setPolicies(data);
        } catch (error) {
          console.error('Error fetching policies:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPolicies();
    }, []);
  
    if (loading) {
      return <p className="text-center text-gray-500">Loading policies...</p>;
    }
  
    if (policies.length === 0) {
      return <p className="text-center text-gray-500">No policies available.</p>;
    }
  
    return (
      <div className="policy-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>
    );
  };
  
  const Homepage: React.FC = () => (
    <div className="app-container font-sans bg-gray-100 min-h-screen">
      <header className="bg-white shadow p-4 text-center text-2xl font-bold">
        Insurance policies available
      </header>
      <main className="p-6">
        <PolicyList />
      </main>
    </div>
  );
  
  export default Homepage;