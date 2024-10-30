import { useEffect, useState } from 'react';
import { Spin, Row, Col, Button, Typography, Form, Input } from 'antd';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const moduleAddress = '0x2666f7675ea61df2c18edfe11836460770c828c58901ef160519fa1e08f9e089';

// Initialize Aptos configuration
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

// Identity type
type Identity = {
  name: string;
  address: string;
  enrollment_year: number;
  major: string;
};

const Main = () => {
  const { account, connect, signAndSubmitTransaction } = useWallet();
  const [accountHasIdentity, setAccountHasIdentity] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (account) {
      fetchIdentity();
    }
  }, [account]);

  // Fetch the user's identity from the blockchain
  const fetchIdentity = async () => {
    if (!account) return;

    try {
      const resource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: `${moduleAddress}::student_identity_nft::studentNFT`,
      });

      const identityData = resource.data;
      if (identityData) {
        setIdentity({
          name: identityData.name,
          address: account.address,
          enrollment_year: identityData.enrollment_year,
          major: identityData.major,
        });
        setAccountHasIdentity(true);
      }
    } catch (error) {
      console.error('Error fetching identity:', error);
      if (error.message.includes('module_not_found')) {
        console.error('The specified module does not exist. Please check the address and module name.');
      }
      setAccountHasIdentity(false);
    }
  };

  // Add a new identity by submitting a transaction
  const addNewIdentity = async (values: Identity) => {
    if (!account) return;

    setTransactionInProgress(true);

    const transaction = {
      data: {
        function: `${moduleAddress}::student_identity_nft::create_identity`,
        functionArguments: [values.name, account.address, values.enrollment_year, values.major],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      form.resetFields();
      fetchIdentity();
    } catch (error) {
      console.error('Error adding new identity:', error);
      setAccountHasIdentity(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <main className="border-2 border-black/10 rounded-lg p-3 mt-[40px] md:mt-[70px]">
      <Spin spinning={transactionInProgress}>
        {!account ? (
          <Row justify="center">
            <Col>
              <Typography.Title level={4}>Connect Your Wallet</Typography.Title>
              <Button
                type="primary"
                onClick={connect}
              >
                Connect Wallet
              </Button>
            </Col>
          </Row>
        ) : accountHasIdentity ? (
          <div>
            <Typography.Title level={4}>Identity Details</Typography.Title>
            <Typography.Paragraph>Name: {identity?.name}</Typography.Paragraph>
            <Typography.Paragraph>Address: {identity?.address}</Typography.Paragraph>
            <Typography.Paragraph>Enrollment Year: {identity?.enrollment_year}</Typography.Paragraph>
            <Typography.Paragraph>Major: {identity?.major}</Typography.Paragraph>
          </div>
        ) : (
          <Form
            form={form}
            onFinish={addNewIdentity}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="enrollment_year"
              rules={[{ required: true, message: 'Please input your enrollment year!' }]}
            >
              <Input
                placeholder="Enrollment Year"
                type="number"
              />
            </Form.Item>
            <Form.Item
              name="major"
              rules={[{ required: true, message: 'Please input your major!' }]}
            >
              <Input placeholder="Major" />
            </Form.Item>
            <Row gutter={[0, 32]}>
              <Col
                span={8}
                offset={8}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ height: '40px', backgroundColor: '#3f67ff' }}
                >
                  Add New Identity
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Spin>
    </main>
  );
};

export default Main;
