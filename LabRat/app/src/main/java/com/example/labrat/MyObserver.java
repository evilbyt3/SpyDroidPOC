package com.example.labrat;

import android.content.Context;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.util.Log;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;


class MyObserver extends ContentObserver {


    private Context context;
    private String lastSmsId;

    public MyObserver(Handler handler, Context context) {
        super(handler);
        this.context = context;
    }

    @Override
    public void onChange(boolean selfChange) {
        super.onChange(selfChange);

        Uri uriSMSURI = Uri.parse("content://sms");
        Cursor cursor = context.getContentResolver().query(uriSMSURI, null, null, null, null);
        cursor.moveToNext();

        String id = cursor.getString(cursor.getColumnIndex("_id"));

        if (smsChecker(id)) {

            // Create the SMS Object
            String type = cursor.getString(cursor.getColumnIndexOrThrow("type")).toString();
            String message = cursor.getString(cursor.getColumnIndexOrThrow("body")).toString();
            String address = cursor.getString(cursor.getColumnIndexOrThrow("address")).toString();
            String date = cursor.getString(cursor.getColumnIndexOrThrow("date")).toString();
            String read = cursor.getString(cursor.getColumnIndexOrThrow("read")).toString();
            date = get_Long_Date(date);

            HashMap<String, String> params = new HashMap<>();
            params.put("address", address);
            params.put("content", message);
            params.put("date", date);
            params.put("read",  read);
            params.put("type", type);

            Log.i("TEST", params.toString());
        }
    }

    // Prevent duplicate results without overlooking legitimate duplicates
    public boolean smsChecker(String smsId) {
        boolean flagSMS = true;

        if (smsId.equals(lastSmsId)) {
            flagSMS = false;
        }
        else {
            lastSmsId = smsId;
        }

        return flagSMS;
    }

    private String get_Long_Date(String date) {
        Long timestamp = Long.parseLong(date);
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(timestamp);
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        return formatter.format(calendar.getTime());
    }
}
