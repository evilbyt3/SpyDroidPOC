package com.example.labrat;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {


    private ImageView imageView;
    public static final int RequestPermissionCode = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
//            checkSelfPermission(Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED)
//        {
//            requestPermissions(new String[]{Manifest.permission.RECEIVE_SMS}, 1000);
//        }
//
//
//        if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.READ_PHONE_STATE}, 1001);
//        }
//
//
//        final Button serviceBtn = (Button) findViewById(R.id.service_monitor_btn);
//        serviceBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                // Start Service
//                if (ServiceIsRunning(MyService.class)) {
//                    stopService(new Intent(MainActivity.this, MyService.class));
//                    serviceBtn.setText("Start Monitoring");
//                }
//                else {
//                    startService(new Intent(MainActivity.this, MyService.class));
//                    serviceBtn.setText("Stop Monitoring");
//                }
//            }
//        });



        Button btnTakePhoto = findViewById(R.id.button);
        imageView = findViewById(R.id.imageView);

        EnableRuntimePermission();

        btnTakePhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(intent, 7);
            }
        });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 7 && resultCode == RESULT_OK) {
            Bitmap bitmap = (Bitmap) data.getExtras().get("data");
            imageView.setImageBitmap(bitmap);
        }
    }
    public void EnableRuntimePermission(){
        if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
                Manifest.permission.CAMERA)) {
            Toast.makeText(MainActivity.this,"CAMERA permission allows us to Access CAMERA app",     Toast.LENGTH_LONG).show();
        } else {
            ActivityCompat.requestPermissions(MainActivity.this,new String[]{
                    Manifest.permission.CAMERA}, RequestPermissionCode);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] result) {
        switch (requestCode) {
            case RequestPermissionCode:
                if (result.length > 0 && result[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(MainActivity.this, "Permission Granted, Now your application can access CAMERA.", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(MainActivity.this, "Permission Canceled, Now your application cannot access CAMERA.", Toast.LENGTH_LONG).show();
                }
                break;
        }
    }

//    @Override
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
//        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//
//        if (requestCode == 1000) {
//            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                Toast.makeText(this, "Permissions Granted", Toast.LENGTH_SHORT).show();
//            }
//            else {
//                Toast.makeText(this, "Permissions Denied", Toast.LENGTH_SHORT).show();
//                finish();
//            }
//        }
//
//        if (requestCode == 1001) {
//            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                Toast.makeText(this, "Permissions Granted", Toast.LENGTH_SHORT).show();
//            }
//            else {
//                Toast.makeText(this, "Permissions Denied", Toast.LENGTH_SHORT).show();
//                finish();
//            }
//        }
//
//    }

    // Checks if a service is runnings
    private boolean ServiceIsRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

}
