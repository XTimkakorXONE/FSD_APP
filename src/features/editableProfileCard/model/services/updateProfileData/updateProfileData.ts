import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Profile } from 'entities/Profile';
import { ValidateProfileErrors } from '../../types/editableProfileCardSchema';
import { getProfileForm } from '../../selectors/getProfileForm/getProfileForm';
import { validateProfileData } from '../validateProfileData/validateProfileData';

export const updateProfileData = createAsyncThunk<Profile, void, ThunkConfig<ValidateProfileErrors[]>>(
    'profile/updateProfileData',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;
        const formData = getProfileForm(getState());

        const errors = validateProfileData(formData);

        if (errors.length) {
            return rejectWithValue(errors);
        }

        try {
            const { data } = await extra.api.put<Profile>(
                `/profile${formData?.id}`,
                formData,
            );

            if (!data) {
                throw new Error();
            }

            return data;
        } catch (err) {
            console.log(err);
            return rejectWithValue([ValidateProfileErrors.SERVER_ERROR]);
        }
    },
);
