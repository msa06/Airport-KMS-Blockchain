pragma solidity ^0.5.0;

contract AirportDatabase {
    uint256 public postCount = 0;

    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string filehash;
        string filename;
        bool approval_status;
        address payable author;
    }

    event PostCreated(
        uint256 id,
        string filehash,
        string filename,
        bool approval_status,
        address payable author
    );

    event PostApproved(
        uint256 id,
        string filehash,
        string filename,
        bool approval_status,
        address payable author
    );

    function createPost(string memory _filehash, string memory _filename)
        public
    {
        // Require Valid Content
        require(bytes(_filehash).length > 0, "FileHash should not be Empty");
        require(bytes(_filename).length > 0, "FileName should not be Empty");
        // Increment the post count
        postCount++;
        // Create the post
        posts[postCount] = Post(
            postCount,
            _filehash,
            _filename,
            false,
            msg.sender
        );

        // Trigger Event
        emit PostCreated(postCount, _filehash, _filename, false, msg.sender);
    }

    function approvePost(uint256 _id) public payable {
        // Make sure the id is Valid
        require(_id > 0 && _id <= postCount, "Post doesnot exist Yet");
        // Fetch the post
        Post memory _post = posts[_id];
        // Increment the tip Amount
        _post.approval_status = true;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostApproved(
            postCount,
            _post.filehash,
            _post.filename,
            _post.approval_status,
            _post.author
        );
    }

}
