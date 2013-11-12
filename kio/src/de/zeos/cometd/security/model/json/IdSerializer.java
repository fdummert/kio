package de.zeos.cometd.security.model.json;

import java.io.IOException;
import java.lang.reflect.Method;

import org.springframework.beans.BeanUtils;
import org.springframework.util.ReflectionUtils;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdScalarSerializer;

public class IdSerializer extends StdScalarSerializer<Object> {

    public IdSerializer() {
        super(Object.class);
    }

    @Override
    public void serialize(Object value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
        Method m = BeanUtils.getPropertyDescriptor(value.getClass(), "id").getReadMethod();
        String id = (String) ReflectionUtils.invokeMethod(m, value);
        jgen.writeString(id);
    }

}
