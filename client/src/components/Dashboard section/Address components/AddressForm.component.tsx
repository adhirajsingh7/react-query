import React, { useEffect } from "react";
import { Box, Button, FormHelperText, Stack, Typography } from "@mui/material";
import FormInputText from "../../Form components/FormInputText";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TAddressSchema, addressSchema } from "../../../lib/type";
import { LoadingButton } from "@mui/lab";
import { address_type_options } from "../../../lib/constants";
import { FormInputRadio } from "../../Form components/FormInputRadio";
import { useCreateAddress } from "@/features/address/api/createAddress";
import { useUpdateAddress } from "@/features/address/api/updateAddress";
interface propTypes {
  address?: IAddress;
  closeModal: () => void;
}

export const AddressFormComponent = (props: propTypes) => {
  const userId = JSON.parse(localStorage.getItem("userId") || "");
  const { address, closeModal } = props;
  console.log(address);

  const { isPending, mutate: createAddressMutation } = useCreateAddress(userId);

  const { isPending: isUpdatePending, mutate: updateAddressMutation } =
    useUpdateAddress(address?._id);

  const defaultValues = {
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    locality: "",
    flat_no: "",
    landmark: "",
    address_type: "home",
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<TAddressSchema>({
    defaultValues,
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (address) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
    if (address) {
      updateAddressMutation(data);
    } else {
      createAddressMutation(data);
    }
    reset();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={2} sx={{ minWidth: "600px" }}>
        <Typography variant="h4">{address ? "Edit" : "Add"} address</Typography>
        <Stack direction="column" gap={2}>
          <Typography variant="h6">Contact Info</Typography>
          <Stack direction="row" gap={2}>
            <FormInputText
              type="text"
              name={"name"}
              control={control}
              label={"Name"}
            />
            <FormInputText
              type="number"
              name={"phone"}
              control={control}
              label={"Phone"}
            />
          </Stack>
        </Stack>
        <Stack direction="column" gap={2}>
          <Typography variant="h6">Address Info</Typography>
          <Box sx={{ width: "200px" }}>
            <FormInputText
              type="number"
              name={"pincode"}
              control={control}
              label={"Pincode"}
            />
          </Box>
          <Stack direction="row" gap={2}>
            <FormInputText
              type="text"
              name={"city"}
              control={control}
              label={"City"}
            />
            <FormInputText
              type="text"
              name={"state"}
              control={control}
              label={"State"}
            />
            <FormInputText
              type="text"
              name={"country"}
              control={control}
              label={"Country"}
            />
          </Stack>
          <Stack direction="column" gap={3} mt={2}>
            <FormInputText
              type="text"
              name={"locality"}
              control={control}
              label={"Locality/Area/Street"}
            />
            <FormInputText
              type="text"
              name={"flat_no"}
              control={control}
              label={"Flat no/Building Name"}
            />
          </Stack>
        </Stack>
        <Box>
          <FormInputText
            type="text"
            name={"landmark"}
            control={control}
            label={"Landmark"}
          />
          <FormHelperText sx={{ ml: 1 }}>optional</FormHelperText>
        </Box>
        <Stack direction="column" gap={2}>
          <FormInputRadio
            name={"address_type"}
            control={control}
            label={"Type of Address"}
            options={address_type_options}
            error={errors.address_type}
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => closeModal()}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            loading={isPending || isUpdatePending}
            loadingPosition="center"
            variant="contained"
          >
            <span>{address ? "Edit" : "Create"}</span>
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
};
