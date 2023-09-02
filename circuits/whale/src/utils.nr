use dep::std::hash::keccak256;

fn arr32_to_field(num_arr: [u8; 32]) -> Field {
    let mut out: Field = 0;
    let mut v: Field = 1;
    for i in 0..32 {
        out += num_arr[31 - i] as Field * v;
        v *= 256;
    }
    out
}

fn arr64_to_field(num_arr: [u8; 64]) -> Field {
    let mut out: Field = 0;
    let mut v: Field = 1;
    for i in 0..64 {
        out += num_arr[63 - i] as Field * v;
        v *= 256;
    }
    out
}

fn get_storage_slot(
    address: Field,
    slot: u8,
) -> [u8; 32] {
    let address_array = address.to_be_bytes(20);
    let mut address_array_padded = [0;32];
    for i in 0..20 {
        address_array_padded[i+12] = address_array[i];
    }
    let mut slot_array_padded = [0;32];
    slot_array_padded[31] = slot;

    let mut concatenated = [0;64];
    for i in 0..32 {
        concatenated[i] = address_array_padded[i];
        concatenated[i+32] = slot_array_padded[i];
    }

    let h = keccak256(concatenated, 64);
    h
}