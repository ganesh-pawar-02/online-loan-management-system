const columns = [
    { field: 'id', headerName: 'User ID', width: 190 },  // Corresponds to 'id' from API response
    { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
    {
        field: 'email',  // Corresponds to 'email' from API response
        headerName: 'Email',
        width: 250,
        editable: true,
        renderCell: (params) => (
            <span className="text-blue-500 font-semibold">
                {params.value}
            </span>
        ),
    },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 180, editable: true },  // Corresponds to 'phoneNumber' from API response
    { field: 'walletId', headerName: 'Wallet ID', width: 180, editable: true },  // Corresponds to 'walletId' from API response
    
];

export default columns;