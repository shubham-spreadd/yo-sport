import { useQuery, gql } from "@apollo/client";
import CityList from "./CityList";

const GET_LOCATIONS = gql`
  query GetCityList($search: String!, $first: Int!) {
    cities(search: $search, first: $first) {
      total
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          ...CityListFragment
        }
      }
    }
  }
  ${CityList.fragments.city}
`;

const DisplayLocations = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS, {
    variables: { search: "vad", first: 5 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.cities.edges.map(({ cursor, node }) => (
    <CityList key={cursor} {...node} />
  ));
};

export default DisplayLocations;
