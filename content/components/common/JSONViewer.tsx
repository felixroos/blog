import canUseDOM from '../canUseDOM';
const ReactJson = canUseDOM() ? require('react-json-view').default : null;

export default function RealParser({ json }) {
  return ReactJson ? (
    <ReactJson collapsed={true} src={json} theme="monokai" />
  ) : (
    <>not a browser</>
  );
}
