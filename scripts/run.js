const main = async () => {
  // The first return is the deployer, the second is a random account
  const [owner, randomPerson, rando2] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("theme");
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  let txn = await domainContract.register("myTheme", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();

  txn = await domainContract.connect(randomPerson).register("otherOne", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();

  const domainAddress = await domainContract.getAddress("myTheme");
  console.log("Owner of domain myTheme:", domainAddress);

  // Trying to set a record that doesn't belong to me!
  txn = await domainContract
    .connect(randomPerson)
    .setRecord("another record", "Haha my domain!");
  await txn.wait();

  const anotherAddress = await domainContract
    .connect(rando2)
    .getAddress("another record");
  console.log(
    'a third party got the address for "another record": %s',
    anotherAddress
  );
  const anotherRecord = await domainContract
    .connect(rando2)
    .getRecord("another record");
  console.log(
    'a third party got the record for "another record": %s',
    anotherRecord
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
