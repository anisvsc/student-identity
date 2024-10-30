// wallet stuff
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';

import { Col } from 'antd';

const Navbar = () => {
  return (
    <>
      {/* navbar */}
      <header className="flex justify-between items-center font-mono py-2">
        {/* left side icon with name of logo */}
        <div className="flex justify-center items-center gap-2">
          <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white">I</div>
          <div className="text-[32px] font-bold hidden md:block">IdentiFi</div> {/* Hidden on small screens */}
        </div>

        <Col style={{ textAlign: 'right' }}>
          <WalletSelector />
        </Col>
      </header>
    </>
  );
};

export default Navbar;
