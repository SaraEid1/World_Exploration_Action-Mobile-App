package com.worldexplorationaction.android.ui.trophy;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.photo.PhotoService;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyService;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.Collections;
import java.util.List;


public class TrophyDetailsViewModel extends ViewModel {
    private static final String TAG = TrophyDetailsViewModel.class.getSimpleName();
    //    private final UserService userService;
    private final PhotoService photoService;
    private final MutableLiveData<Trophy> trophy;
    private final TrophyService trophyService;
    private final MutableLiveData<List<Photo>> photos;
    private final MutableLiveData<UserProfile> userProfile;
    private final MutableLiveData<String> toastMessage;
    private final MutableLiveData<Boolean> trophyCollected;

    public TrophyDetailsViewModel() {
        this.userProfile = new MutableLiveData<>();
        this.toastMessage = new MutableLiveData<>();
        this.trophy = new MutableLiveData<>();
        this.trophyCollected = new MutableLiveData<>(false);
        this.photos = new MutableLiveData<>(Collections.emptyList());
//        this.userService = UserService.getService();
        this.photoService = PhotoService.getService();
        this.trophyService = TrophyService.getService();
    }

    public LiveData<UserProfile> getUserProfile() {
        return userProfile;
    }

    public LiveData<Trophy> getTrophyDetails() {
        return trophy;
    }

    public MutableLiveData<List<Photo>> getPhotos() {
        return photos;
    }

    public MutableLiveData<String> getToastMessage() {
        return toastMessage;
    }

    public MutableLiveData<Boolean> getTrophyCollected() {
        return trophyCollected;
    }

    public void fetchTrophy(String trophyId) {
        trophyService.getTrophyDetails(trophyId).enqueue(new CustomCallback<>(responseBody -> {
            Log.d(TAG, "trophyService.getTrophyDetails is succeeded");
            trophy.setValue(responseBody);
        }, null, errorMessage -> {
            Log.e(TAG, "trophyService.getTrophyDetails has an error: " + errorMessage);
        }));
    }

    public void fetchTrophyPhotos(String trophyId, String order) {
        photoService.getPhotoIDsByTrophyID(trophyId, order).enqueue(new CustomCallback<>(responseBody -> {
            Log.d(TAG, "photoService.getPhotoIDsByTrophyID is succeeded");
            if (responseBody == null) {
                Log.e(TAG, "photoService.getPhotoIDsByTrophyID returns null");
                return;
            }
            photos.setValue(responseBody);
        }, null, errorMessage -> {
            Log.e(TAG, "photoService.getPhotoIdsByUserId error: " + errorMessage);
        }));
    }

    public void collectTrophy(String userId, String trophyId) {
        trophyService.collectTrophy(userId, trophyId).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "trophy is collected successfully");
            showToastMessage("You have collected this trophy");
            trophyCollected.setValue(true);
            fetchTrophy(trophyId);
        }, null, errorMessage -> {
            Log.e(TAG, "collecting trophy is failed " + errorMessage);
            showToastMessage("Could not collect trophy");
        }));
    }

    private void showToastMessage(String value) {
        toastMessage.setValue(value);
        toastMessage.setValue(null);
    }

//    public void displayingTrophy(Trophy trophyd) {
//        trophy.setValue(trophyd);
//        photos.setValue(Collections.emptyList());
//        fetchTrophy(trophyd.getId());
//        fetchTrophyPhotos(trophyd.getId(), "random");
//    }
}
