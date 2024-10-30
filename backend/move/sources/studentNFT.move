module student_identity_nft_addr::studentNFT {
    // imports
    use std::string::String;
    use std::signer;

    // struct
    struct StudentIdentity has store, key {
        student_id: u64,
        name: String,
        address: address,  // Fixed spelling from 'adderss' to 'address'
        enrollment_year: u64,
        major: String,
    }

    // function to create nft
    public entry fun create_identity(account: &signer, student_id: u64, name: String, address: address, enrollment_year: u64, major: String) {
        let student_identity = StudentIdentity {
            student_id,  // Corrected field name from 'id' to 'student_id'
            name, 
            address,  // Added address parameter to constructor
            enrollment_year,
            major
        };

        // move the StudentIdentity resource under the signer account
        move_to(account, student_identity);
    }
}
