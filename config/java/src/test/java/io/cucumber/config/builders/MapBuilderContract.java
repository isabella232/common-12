package io.cucumber.config.builders;

import io.cucumber.config.FieldSetter;
import io.cucumber.config.MapBuilder;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public abstract class MapBuilderContract {
    private final Testing testing = new Testing();
    private final FieldSetter fieldSetter = new FieldSetter(testing);

    @Before
    public void setFields() {
        fieldSetter.setFields(makeMapBuilder().buildMap());
    }

    @Test
    public void sets_boolean_field() {
        assertEquals(true, testing.somebool);
    }

    @Test
    public void sets_string_field() {
        assertEquals("hello", testing.message);
    }

    @Test
    public void sets_int_field() {
        assertEquals(42, testing.meaning);
    }

    @Test
    public void sets_string_list_field() {
        assertEquals("one", testing.stringlist.get(0));
        assertEquals("two", testing.stringlist.get(1));
    }

    protected abstract MapBuilder makeMapBuilder();

    public static class Testing {
        public boolean somebool;
        public int meaning;
        public String message;
        public List<String> stringlist = new ArrayList<>();
        public List<String> extra = new ArrayList<>();
    }
}
