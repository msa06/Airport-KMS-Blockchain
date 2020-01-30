const AirportDatabase = artifacts.require("AirportDatabase");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("AirportDatabase", ([deployer, admin, monitor]) => {
  let airportDatabase;

  before(async () => {
    airportDatabase = await AirportDatabase.deployed();
  });

  describe("deployement", async () => {
    it("deploys successfully", async () => {
      const address = await airportDatabase.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("posts", async () => {
    let result, postCount;

    before(async () => {
      result = await airportDatabase.createPost("Hash Value", "First File", {
        from: deployer
      });
      postCount = await airportDatabase.postCount();
    });

    it("creates posts", async () => {
      // TODO: Fill me in

      // Success
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "Id is Correct");
      assert.equal(event.filehash, "Hash Value", "Hash is Correct");
      assert.equal(event.filename, "First File", "Name is Correct");

      assert.equal(event.approval_status, false, "Status is Correct");
      assert.equal(event.author, deployer, "author is Correct");

      // Failure: Post mush have content
      await airportDatabase.createPost("", "", {
        from: deployer
      }).should.be.rejected;
    });

    it("lists posts", async () => {
      // TODO: Fill me in
      const post = await airportDatabase.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "Id is Correct");
      assert.equal(post.filehash, "Hash Value", "Hash is Correct");
      assert.equal(post.filename, "First File", "Name is Correct");
      assert.equal(post.approval_status, false, "Status is Correct");
      assert.equal(post.author, deployer, "author is Correct");
    });

    it("allows users to Approve posts", async () => {
      //get the Author Balance Before tip
      // TODO: Fill me in
      result = await airportDatabase.approvePost(postCount, {
        from: admin
      });

      // Success
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "Id is Correct");
      assert.equal(event.filehash, "Hash Value", "Hash is Correct");
      assert.equal(event.filename, "First File", "Name is Correct");
      assert.equal(event.approval_status, true, "Status is Correct");
      assert.equal(event.author, deployer, "author is Correct");

      //   Failure: Tries to tip a post that does not exist
      await airportDatabase.approvePost(99, {
        from: admin
      }).should.be.rejected;
    });
  });
});
