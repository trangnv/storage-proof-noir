// use crate::BITS_PER_LIMB as BITS;
// global BITS_PER_LIMB: comptime Field = 56; /// Number of bits per limb.
use dep::std::hash::keccak256;

global BITS: comptime Field = 56; /// Number of bits per limb.


// Compute a + b + carry, returning the result and the new carry over.
// TODO: Does carry need to be a u56?
fn adc(a: u56, b: u56, carry: u56) -> (u56, u56) {
    let ret = a as Field + b as Field + carry as Field;
    (ret as u56, (ret as u112 >> BITS as u112) as u56)
}

// Compute a - (b + borrow), returning the result and the new borrow.
fn sbb(a: u56, b: u56, borrow: u56) -> (u56, u56) {
    let ret = a as u112 - (b as u112 + (borrow as u112 >> (BITS as u112 - 1)));
    (ret as u56, (ret >> 56) as u56)
}

// Compute a + (b * c) + carry, returning the result and the new carry over.
fn mac(a: u56, b: u56, c: u56, carry: u56) -> (u56, u56) {
    let ret = (a as Field) + ((b as Field) * (c as Field)) + (carry as Field);
    (ret as u56, (ret as u112 >> BITS as u112) as u56)
}

fn u8_to_u64(num_arr: [u8; 32]) -> Field {
    let mut out: Field = 0;
    let mut v: Field = 1;
    for i in 0..32 {
        out += num_arr[31 - i] as Field * v;
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