package com.example.labrat;

import android.app.Service;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

public class MyService extends Service {

    Context context = this;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Log.i("TEST", "In Service");

        ContentResolver contentResolver = context.getContentResolver();
        contentResolver.registerContentObserver(Uri.parse("content://sms/"),true, new MyObserver(new Handler(), context));
        return Service.START_STICKY;




//        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        Log.i("TEST", "Service stopped");
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
