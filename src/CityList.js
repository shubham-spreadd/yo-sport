import { gql } from "@apollo/client";

function CityList(props) {
  return (
    <div key={props.id}>
      <h3>{props.name}</h3>
      <b>About this location:</b>
      <p>{props.state}</p>
      <p>{props.latitude}</p>
      <p>{props.longitude}</p>
      <br />
    </div>
  );
}

CityList.fragments = {
  city: gql`
    fragment CityListFragment on City {
      id
      name
      latitude
      longitude
      state
    }
  `,
};

export default CityList;
