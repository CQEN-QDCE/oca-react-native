import {CreateStructure} from 'oca-react-native';
import createStructure from '../src/CreateStructure';

const getStructure = async () => {
  let test = await fetch(
    'https://repository.oca.argo.colossi.network/api/v0.1/schemas',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&- 1');
  test = await test.json();
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&- 2');
  const test2 = createStructure(test, {});
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&- 3');
  console.log(test2);
};

export default getStructure;
